import os
import shutil
import subprocess
import yaml

REPOS_YML = "src/_data/repositories.yml"

def load_repositories():
    with open(REPOS_YML, "r") as f:
        data = yaml.safe_load(f)
    return data.get("repositories", [])

def clone_and_process(repo):
    repo_url = repo["github_url"]
    repo_id = repo["id"]
    local_path = repo["local_path"].lstrip("/")
    temp_dir = f"temp-{repo_id}"
    print(f"Cloning {repo_url} into {temp_dir}...")
    subprocess.run(["git", "clone", "--depth", "1", repo_url, temp_dir], check=True)
    # Aqui você pode chamar seu script de processamento, adaptando para cada repo
    # Exemplo:
    process_script = ".github/scripts/process_docs.py"
    if os.path.exists(process_script):
        subprocess.run([
            "python3", process_script,
            f"{temp_dir}/docs", local_path, repo["name"]
        ], check=True)
    shutil.rmtree(temp_dir)

def main():
    repos = load_repositories()
    for repo in repos:
        clone_and_process(repo)
    # Atualize metadados se necessário
    update_script = ".github/scripts/update_repositories_metadata.py"
    if os.path.exists(update_script):
        subprocess.run(["python3", update_script], check=True)

if __name__ == "__main__":
    main()
