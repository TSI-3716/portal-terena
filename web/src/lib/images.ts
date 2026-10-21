/**
 * Imagens estáticas do portal (copiadas de docs/.../assets para public/images).
 * Centralizar os nomes aqui garante que um arquivo inexistente vire erro de tipo.
 */
export const imageNames = [
  "aldeias_1",
  "aldeias_2",
  "aldeias_3",
  "aldeias_hero",
  "contato_hero",
  "cultura_1",
  "cultura_2",
  "cultura_3",
  "cultura_hero",
  "feira_1",
  "feira_2",
  "feira_3",
  "feira_hero",
  "feira_p1",
  "feira_p2",
  "feira_p3",
  "feira_p4",
  "home_hero",
  "home_map",
  "inamaty_hero",
  "juventude_1",
  "juventude_2",
  "juventude_3",
  "juventude_hero",
  "noticias_1",
  "noticias_2",
  "noticias_3",
  "noticias_4",
  "noticias_5",
  "noticias_hero",
  "projetos_1",
  "projetos_2",
  "projetos_3",
  "projetos_hero",
] as const;

export type ImageName = (typeof imageNames)[number];

export function staticImage(name: ImageName) {
  return `/images/${name}.jpg`;
}
