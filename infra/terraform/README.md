# Terraform — Marginalia infra

Provisions the AWS infrastructure for the blog: VPC, EKS cluster, ECR
repositories, the AWS Load Balancer Controller (via IRSA), and a
GitHub Actions OIDC role for keyless CI/CD deploys.

## Prerequisites
- Terraform >= 1.6
- An AWS account with credentials configured (`aws configure` or env vars)
- `kubectl` and `helm` installed locally (optional, for manual checks)

## Usage

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # adjust region/project name if needed
terraform init
terraform plan
terraform apply
```

This takes ~15 minutes, mostly waiting on the EKS control plane.

After apply, point kubectl at the new cluster:

```bash
$(terraform output -raw configure_kubectl)
kubectl get nodes
```

Before this role is usable, edit `eks.tf` and replace
`<github-username>/<repo>` in the `aws_iam_role.github_actions` trust
policy with your actual GitHub repo, then `terraform apply` again.

## What this does NOT do
- Doesn't create a Route53 zone or ACM certificate — the Ingress in
  `infra/k8s/ingress.yaml` assumes plain HTTP via the ALB's default
  DNS name. Add a domain + ACM cert later and annotate the Ingress
  for HTTPS.
- Doesn't provision MongoDB — this project uses MongoDB Atlas
  (managed, outside AWS). Create a free M0 cluster at
  https://www.mongodb.com/cloud/atlas and put the connection string
  in the Kubernetes secret (see `infra/k8s/README.md`).
- State is local by default. For a real setup, uncomment the `s3`
  backend block in `providers.tf` once you've created a state bucket
  + DynamoDB lock table.

## Teardown

```bash
terraform destroy
```

EKS clusters and NAT gateways cost money by the hour — destroy this
when you're not actively demoing it.