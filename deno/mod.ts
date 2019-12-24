import { serve } from "https://deno.land/std@v0.24.0/http/server.ts";
// import { serve } from 'https://deno.land/std@v0.24.0/';

import { hello } from "./a.ts";

const body = new TextEncoder().encode(`${hello}\n`);
const s = serve({ port: 8000 });
(async () => {
  const content = await Deno.readFile("./deno/a.ts");
  console.log(new TextDecoder().decode(content));
  console.table(Deno.metrics());
  console.log("http://localhost:8000/");
  for await (const req of s) {
    req.respond({ body });
  }
})();
