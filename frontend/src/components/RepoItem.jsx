function RepoItem({ repo }) {
  if (!repo) return null;

  return (
    <li className="repo-item">
      <a href={repo.url} target="_blank" rel="noopener noreferrer">
        <h3>{repo.name || "No name"}</h3>
        <span>⭐ {repo.stars || 0}</span>
      </a>
      {repo.description && <p>{repo.description}</p>}
      <div className="repo-meta">
        {console.log(repo)}
        {repo.updated_at && (
          <span>
            Обновлено: {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </li>
  );
}

export default RepoItem;
