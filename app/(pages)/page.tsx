import { dehydrate, QueryClient } from "@tanstack/react-query";
import QueryClientProvider from "@/app/components/QueryClientProvider";
import { Games } from "@/app/components";

async function getData() {
  const res = await fetch(`${process.env.API_DOMAIN}/api/today`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
}

export default async function Page() {
  const data = await getData();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["today"],
    queryFn: getData,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider dehydratedState={dehydratedState}>
      <Games />
    </QueryClientProvider>
  );
}
