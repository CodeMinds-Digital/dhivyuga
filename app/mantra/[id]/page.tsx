import { redirect } from 'next/navigation'

export default async function MantraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/ta/search?mantra=${id}`)
}
