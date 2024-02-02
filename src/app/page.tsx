import SWRProvider from "@/components/SWRProvider";
import Games from "@/components/Games";

async function getData() {
  const res = await fetch(`${process.env.API_DOMAIN}/api/today`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
}

export default async function Page() {
  const data = await getData();

  const fallback = {
    "/api/today": data,
  };

  return (
    <SWRProvider fallback={fallback}>
      <Games />
    </SWRProvider>
  );
}
