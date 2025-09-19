import React from 'react';
import CodeBlock from '../components/CodeBlock';

const CIPlan: React.FC = () => {
  const githubActions = `# GitHub Actions CI/CD Pipeline
name: Vital Vue CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # Code Quality Checks
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install Python dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
        
    - name: Install Node.js dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Lint Python code
      run: |
        flake8 backend/
        black --check backend/
        isort --check-only backend/
        
    - name: Lint TypeScript/React code
      run: |
        cd frontend
        npm run lint
        
    - name: Type check
      run: |
        cd frontend
        npm run type-check
        
    - name: Run Python tests
      run: |
        pytest backend/tests/ -v --cov=backend --cov-report=xml
        
    - name: Run frontend tests
      run: |
        cd frontend
        npm run test:ci
        
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unittests
        name: codecov-umbrella

  # Security Scanning
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
        
    - name: Run Bandit security linter
      run: |
        pip install bandit
        bandit -r backend/ -f json -o bandit-report.json
        
    - name: Run npm audit
      run: |
        cd frontend
        npm audit --audit-level=moderate

  # Build and Push Docker Images
  build-and-push:
    needs: [lint-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request'
    strategy:
      matrix:
        service: [fastapi, ml-service, rasa, worker, mqtt-consumer]
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}-\${{ matrix.service }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=raw,value=latest,enable={{is_default_branch}}
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./\${{ matrix.service }}
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # Deploy to Staging
  deploy-staging:
    needs: [build-and-push]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - name: Deploy to staging
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: \${{ secrets.STAGING_HOST }}
        username: \${{ secrets.STAGING_USER }}
        key: \${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /opt/vitalvue
          git pull origin develop
          docker-compose -f docker-compose.staging.yml pull
          docker-compose -f docker-compose.staging.yml up -d
          
    - name: Run smoke tests
      run: |
        curl -f \${{ secrets.STAGING_URL }}/health || exit 1
        curl -f \${{ secrets.STAGING_URL }}/api/v1/health || exit 1

  # Deploy to Production
  deploy-production:
    needs: [build-and-push]
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: \${{ secrets.PRODUCTION_HOST }}
        username: \${{ secrets.PRODUCTION_USER }}
        key: \${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/vitalvue
          git pull origin main
          docker-compose pull
          docker-compose up -d --no-deps
          
    - name: Run health checks
      run: |
        curl -f \${{ secrets.PRODUCTION_URL }}/health || exit 1
        curl -f \${{ secrets.PRODUCTION_URL }}/api/v1/health || exit 1
        
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: \${{ job.status }}
        channel: '#deployments'
        webhook_url: \${{ secrets.SLACK_WEBHOOK }}

  # Performance Testing
  performance-test:
    needs: [deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run k6 performance tests
      run: |
        docker run --rm -v $PWD/performance-tests:/scripts grafana/k6:latest run /scripts/load-test.js
      env:
        API_URL: \${{ secrets.STAGING_URL }}/api/v1`;

  const dockerfileExample = `# FastAPI Dockerfile Example
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    g++ \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \\
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`;

  const k6LoadTest = `// K6 Performance Test Script
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8000/api/v1';

export function setup() {
  // Login and get token
  const loginResponse = http.post(\`\${BASE_URL}/auth/login\`, JSON.stringify({
    username: 'test_user',
    password: 'test_password'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  return {
    token: loginResponse.json('access_token'),
  };
}

export default function(data) {
  const params = {
    headers: {
      'Authorization': \`Bearer \${data.token}\`,
      'Content-Type': 'application/json',
    },
  };

  // Test report creation
  const reportPayload = {
    reporter_id: 'test_reporter_123',
    region_id: 'region_001',
    gps_latitude: 12.9716,
    gps_longitude: 77.5946,
    language: 'en',
    symptoms: ['fever', 'diarrhea'],
    patient_count: 1,
    water_observed_flag: true
  };

  const reportResponse = http.post(\`\${BASE_URL}/reports\`, JSON.stringify(reportPayload), params);

  check(reportResponse, {
    'report creation status is 201': (r) => r.status === 201,
    'report creation response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  // Test report listing
  const listResponse = http.get(\`\${BASE_URL}/reports?page=1&limit=10\`, params);

  check(listResponse, {
    'report list status is 200': (r) => r.status === 200,
    'report list response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  // Test forecast endpoint
  const forecastResponse = http.get(\`\${BASE_URL}/forecast?region_id=region_001&horizon=7\`, params);

  check(forecastResponse, {
    'forecast status is 200': (r) => r.status === 200,
    'forecast response time < 2000ms': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(1);
}
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CI/CD Pipeline</h1>
          <p className="text-xl text-gray-600">Automated testing, building, and deployment with GitHub Actions</p>
        </div>

        <div className="space-y-8">
          {/* GitHub Actions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">GitHub Actions Workflow</h2>
            <p className="text-gray-700 mb-4">
              Complete CI/CD pipeline with code quality checks, security scanning, Docker image building, 
              and automated deployment to staging and production environments.
            </p>
            <CodeBlock code={githubActions} language="yaml" filename=".github/workflows/ci-cd.yml" />
          </div>

          {/* Dockerfile Example */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dockerfile Example</h2>
            <p className="text-gray-700 mb-4">
              Optimized Dockerfile for FastAPI service with multi-stage builds, security best practices, 
              and health checks.
            </p>
            <CodeBlock code={dockerfileExample} language="dockerfile" filename="Dockerfile" />
          </div>

          {/* Performance Testing */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Testing</h2>
            <p className="text-gray-700 mb-4">
              K6 load testing script for API performance validation with realistic user scenarios 
              and performance thresholds.
            </p>
            <CodeBlock code={k6LoadTest} language="javascript" filename="performance-tests/load-test.js" />
          </div>

          {/* Pipeline Stages */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pipeline Stages</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary-600">Code Quality</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Linting:</strong> Flake8, Black, isort for Python</li>
                    <li>• <strong>Type Checking:</strong> TypeScript strict mode</li>
                    <li>• <strong>Code Formatting:</strong> Prettier for frontend</li>
                    <li>• <strong>Import Sorting:</strong> isort for Python imports</li>
                    <li>• <strong>Code Coverage:</strong> Minimum 80% coverage required</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Security Scanning</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Vulnerability Scanning:</strong> Trivy for container images</li>
                    <li>• <strong>Code Security:</strong> Bandit for Python security issues</li>
                    <li>• <strong>Dependency Audit:</strong> npm audit for Node.js</li>
                    <li>• <strong>SAST:</strong> Static Application Security Testing</li>
                    <li>• <strong>License Compliance:</strong> Check for license conflicts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">Testing</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Unit Tests:</strong> pytest for Python, Jest for React</li>
                    <li>• <strong>Integration Tests:</strong> API endpoint testing</li>
                    <li>• <strong>Performance Tests:</strong> K6 load testing</li>
                    <li>• <strong>Smoke Tests:</strong> Basic functionality verification</li>
                    <li>• <strong>E2E Tests:</strong> Playwright for frontend testing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-orange-600">Deployment</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Staging:</strong> Automatic deployment on develop branch</li>
                    <li>• <strong>Production:</strong> Manual deployment on release</li>
                    <li>• <strong>Blue-Green:</strong> Zero-downtime deployments</li>
                    <li>• <strong>Rollback:</strong> Automatic rollback on failure</li>
                    <li>• <strong>Health Checks:</strong> Post-deployment verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Environments */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Deployment Environments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Development</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Local Docker Compose setup</li>
                  <li>• Hot reload for development</li>
                  <li>• Debug logging enabled</li>
                  <li>• Test data seeding</li>
                  <li>• Development SSL certificates</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Staging</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Production-like environment</li>
                  <li>• Automated testing</li>
                  <li>• Performance validation</li>
                  <li>• Security scanning</li>
                  <li>• Staging SSL certificates</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Production</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• High availability setup</li>
                  <li>• Load balancing</li>
                  <li>• Monitoring & alerting</li>
                  <li>• Automated backups</li>
                  <li>• Production SSL certificates</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quality Gates */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality Gates</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-green-800 mb-2">Code Quality Gates</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All linting checks must pass</li>
                  <li>• Code coverage must be ≥ 80%</li>
                  <li>• No critical security vulnerabilities</li>
                  <li>• All tests must pass</li>
                  <li>• TypeScript compilation must succeed</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Performance Gates</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• API response time &lt; 500ms (95th percentile)</li>
                  <li>• Error rate &lt; 1%</li>
                  <li>• Memory usage &lt; 512MB per container</li>
                  <li>• CPU usage &lt; 70% under load</li>
                  <li>• Database query time &lt; 100ms</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Security Gates</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• No high or critical vulnerabilities</li>
                  <li>• Dependencies must be up to date</li>
                  <li>• Secrets must not be exposed</li>
                  <li>• Container images must be scanned</li>
                  <li>• SSL certificates must be valid</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Monitoring & Alerting */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">CI/CD Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Pipeline Metrics</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Build success/failure rates</li>
                  <li>• Average build duration</li>
                  <li>• Test execution time</li>
                  <li>• Deployment frequency</li>
                  <li>• Lead time for changes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Alerting Channels</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Slack notifications for failures</li>
                  <li>• Email alerts for critical issues</li>
                  <li>• GitHub status checks</li>
                  <li>• Dashboard monitoring</li>
                  <li>• Mobile push notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIPlan;
