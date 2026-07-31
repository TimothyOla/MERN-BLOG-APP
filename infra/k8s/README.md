# Kubernetes manifests — Marginalia

Deploys the blog to the EKS cluster provisioned by `infra/terraform`.
Routing: the ALB Ingress sends `/api/*` to the backend Service and
everything else to the frontend Service (static build served by nginx).

## One-time setup

1. Provision the cluster: see `infra/terraform/README.md`.
2. Point kubectl at it:
```bash
   aws eks update-kubeconfig --region us-east-1 --name marginalia
```
3. Create the namespace and secrets:
```bash
   kubectl apply -f namespace.yaml
   cp secrets.example.yaml secrets.yaml
   # edit secrets.yaml with your real MongoDB Atlas URI + JWT secret
   kubectl apply -f secrets.yaml
   kubectl apply -f backend-configmap.yaml
```

## Deploying

In normal use, the GitHub Actions workflow (`.github/workflows/ci-cd.yml`)
builds the images, pushes them to ECR, substitutes the image tag into
`backend-deployment.yaml` / `frontend-deployment.yaml`, and applies
everything. To do it by hand instead:

```bash
kubectl set image deployment/backend backend=<ecr-backend-url>:<tag> -n marginalia
kubectl set image deployment/frontend frontend=<ecr-frontend-url>:<tag> -n marginalia
kubectl apply -f ingress.yaml
```

## Checking status

```bash
kubectl get pods -n marginalia
kubectl get ingress -n marginalia    # shows the ALB's public DNS name once provisioned
kubectl logs -n marginalia deployment/backend
```

The ALB usually takes 2-3 minutes to provision after the first
`kubectl apply -f ingress.yaml`. Once you have a domain, point a CNAME
at the ALB's DNS name and add an ACM certificate for HTTPS (see the
commented annotations in `ingress.yaml`).