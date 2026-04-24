import { BitacoraDetalle } from "../components/BitacoraDetalle";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BitacoraDetallePage({ params }: Props) {
  const { id } = await params;
  return <BitacoraDetalle idTema={Number(id)} />;
}
