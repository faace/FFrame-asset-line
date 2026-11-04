import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateImage, editImage } from 'file:///D:/ai/mcp/cubence-image/cubence-image-lib.mjs';

const config = readFileSync('C:/Users/admin/.codex/config.toml', 'utf8');
const section = config.split('[mcp_servers.cubence_image.env]')[1]?.split(/^\[/m)[0];
const apiKey = section?.match(/^\s*CUBENCE_API_KEY\s*=\s*["']([^"']+)["']/m)?.[1];
if (!apiKey) throw new Error('Cubence API Key not found in configured MCP environment.');
const batch = process.argv[2] || '01';
if (!['01', '02'].includes(batch)) throw new Error('Batch must be 01 or 02.');
const spec = readFileSync(new URL(`./物品批量-${batch}.md`, import.meta.url), 'utf8');
const prompt = spec.split('## 生成提示词')[1].split('## 审核与下一批规则')[0].trim();

for (const model of ['gpt-image-2.5-flare', 'gpt-image-2.5-sunburst']) {
  console.log(`Trying ${model}, 1024x1024`);
  try {
    const outputPath = fileURLToPath(new URL(`./物品批量-${batch}-${model}-v1.png`, import.meta.url));
    const args = { apiKey, baseUrl: 'https://api.cubence.top/v1', model, prompt, size: '1024x1024', outputFormat: 'png', outputPath };
    const result = batch === '02'
      ? await editImage({ ...args, inputPath: fileURLToPath(new URL('./物品批量-01-gpt-image-2.5-flare-v1.png', import.meta.url)) })
      : await generateImage({ ...args, quality: 'high' });
    console.log(`Saved: ${result}`);
    process.exit(0);
  } catch (error) {
    console.error(String(error.message).replaceAll(apiKey, '[REDACTED]'));
  }
}
process.exitCode = 1;
