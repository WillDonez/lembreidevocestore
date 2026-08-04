export type ImagemGaleria = {
  id: string;
  url: string;
  ordem: number;
  arquivo?: File;
  temporaria?: boolean;
};

export type ImagemGaleriaSalva = {
  id: number;
  produto_id: number;
  url: string;
  ordem: number;
  created_at?: string;
};

export type ImagemGaleriaUpload = {
  url: string;
  caminho: string;
  ordem: number;
};