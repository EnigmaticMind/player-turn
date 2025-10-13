import type { Config } from "@react-router/dev/config";
import packageInfo from './package.json';


export default {
  appDirectory: "app",
  buildDirectory: "build",
  basename: process.env.NODE_ENV === 'development' ? '/' : `/${packageInfo.name}`,
  ssr: false,
} satisfies Config;
