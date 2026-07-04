#!/usr/bin/env python
"""Sync Tailwind CSS docs snapshot into this skill.

Clones the tailwindcss.com repo (or uses an existing local clone) and copies
`src/docs` plus the docs index into references.
"""

from __future__ import annotations

import argparse
import datetime as dt
import shutil
import subprocess
import tempfile
from pathlib import Path

DEFAULT_REPO_URL = "https://github.com/tailwindlabs/tailwindcss.com"
DEFAULT_REF = "main"
LICENSE_URL = "https://github.com/tailwindlabs/tailwindcss.com#license"


def run(cmd: list[str], cwd: Path | None = None) -> str:
    result = subprocess.run(cmd, cwd=cwd, check=True, capture_output=True, text=True)
    return result.stdout.strip()


def clone_repo(repo_url: str, ref: str, dest: Path) -> None:
    run(["git", "clone", "--depth", "1", "--branch", ref, repo_url, str(dest)])


def update_repo(repo_dir: Path, ref: str) -> None:
    run(["git", "fetch", "--depth", "1", "origin", ref], cwd=repo_dir)
    run(["git", "checkout", ref], cwd=repo_dir)
    run(["git", "reset", "--hard", f"origin/{ref}"], cwd=repo_dir)


def write_source_file(
    path: Path,
    repo_url: str,
    commit: str,
    commit_date: str,
    snapshot_date: str,
) -> None:
    content = "\n".join(
        [
            f"Source: {repo_url}",
            f"Commit: {commit}",
            f"Commit-Date: {commit_date}",
            "Docs-Path: src/docs",
            "Index-Path: src/app/(docs)/docs/index.tsx",
            f"Snapshot-Date: {snapshot_date}",
            "",
        ]
    )
    path.write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-url", default=DEFAULT_REPO_URL)
    parser.add_argument("--ref", default=DEFAULT_REF)
    parser.add_argument(
        "--local-repo",
        default=None,
        help="Use an existing local repo clone instead of cloning a temp copy.",
    )
    parser.add_argument(
        "--accept-docs-license",
        action="store_true",
        help="Acknowledge the Tailwind docs license before downloading.",
    )
    args = parser.parse_args()

    if not args.accept_docs_license:
        raise SystemExit(
            "This script downloads docs from tailwindcss.com, which is source-available "
            "but not open-source. Review the license and re-run with "
            f"--accept-docs-license. License: {LICENSE_URL}"
        )

    skill_root = Path(__file__).resolve().parents[1]
    references_dir = skill_root / "references"
    docs_dir = references_dir / "docs"
    index_out = references_dir / "docs-index.tsx"
    source_out = references_dir / "docs-source.txt"

    if args.local_repo:
        repo_dir = Path(args.local_repo).resolve()
        if not repo_dir.exists():
            raise SystemExit(f"Local repo not found: {repo_dir}")
        update_repo(repo_dir, args.ref)
        cleanup = None
    else:
        temp_dir = tempfile.TemporaryDirectory()
        repo_dir = Path(temp_dir.name)
        clone_repo(args.repo_url, args.ref, repo_dir)
        cleanup = temp_dir

    try:
        docs_src = repo_dir / "src" / "docs"
        index_src = repo_dir / "src" / "app" / "(docs)" / "docs" / "index.tsx"

        if not docs_src.exists():
            raise SystemExit(f"Docs folder not found: {docs_src}")
        if not index_src.exists():
            raise SystemExit(f"Docs index not found: {index_src}")

        if docs_dir.exists():
            shutil.rmtree(docs_dir)
        docs_dir.mkdir(parents=True, exist_ok=True)
        shutil.copytree(docs_src, docs_dir, dirs_exist_ok=True)
        shutil.copy2(index_src, index_out)

        commit = run(["git", "rev-parse", "HEAD"], cwd=repo_dir)
        commit_date = run(["git", "log", "-1", "--format=%ci"], cwd=repo_dir)
        snapshot_date = dt.date.today().isoformat()
        write_source_file(source_out, args.repo_url, commit, commit_date, snapshot_date)
    finally:
        if cleanup is not None:
            cleanup.cleanup()


if __name__ == "__main__":
    main()
