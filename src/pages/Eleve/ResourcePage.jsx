import { useLocation } from "react-router-dom";

function ResourcePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const url = queryParams.get("url");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ressource</h1>
      {url ? (
        <iframe src={url} className="w-full h-[80vh]" title="Resource" />
      ) : (
        <p className="text-red-500">Aucun fichier trouvé.</p>
      )}
    </div>
  );
}

export default ResourcePage;
