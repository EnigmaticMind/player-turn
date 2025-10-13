import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Robert Rice" },
    { name: "description", content: "Robert Rice Resume!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
