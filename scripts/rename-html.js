import { rename, existsSync } from "fs";
import { join } from "path";

const distPath = "dist";
const basicHtml = join(distPath, "index.basic.html");
const advancedHtml = join(distPath, "advanced", "index.advanced.html");
const basicTarget = join(distPath, "index.html");
const advancedTarget = join(distPath, "advanced", "index.html");

// basic HTML 이름 변경
if (existsSync(basicHtml)) {
  rename(basicHtml, basicTarget, (err) => {
    if (err) {
      console.error("Error renaming basic HTML:", err);
      process.exit(1);
    }
    console.log("✅ Renamed index.basic.html to index.html");
  });
}

// advanced HTML 이름 변경
if (existsSync(advancedHtml)) {
  rename(advancedHtml, advancedTarget, (err) => {
    if (err) {
      console.error("Error renaming advanced HTML:", err);
      process.exit(1);
    }
    console.log("✅ Renamed index.advanced.html to index.html");
  });
}
