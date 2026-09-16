# 规则 Wiki 编写交接

这里是新 Wiki 的 Markdown 源码。目前所有页面均为 `draft` 占位；目录标题不构成已确认玩法。不要自动复制旧 Rulebook 或按当前代码补写规则。

## 下一次讨论

每次选一个主题，比较旧文档和实现，列出冲突与缺口。用户确认后再写入规则、边界、案例和关联页面，并记录替代了哪些旧章节；工程实现与设计决定分别记录。

## 文件约定

- 每页 frontmatter 必须有 `title`、稳定 `id` 和 `status`（`draft`／`approved`／`retired`）。未经确认保持 `draft`。
- `navigation.json` 控制分组与页序；章节索引和子页都必须列出。稳定 ID 不包含目录序号，移动文件时保留 ID。
- 使用普通 Markdown（标题、表格、列表、代码块）和相对 `.md` 链接。链接可带标题生成的锚点。构建器会检查目标页面与锚点。
- 标题锚点保留字母、数字、中文与连字符；空格改为连字符，重复标题追加 `-2`、`-3`。长期条款引用应在标题中包含稳定规则编号。
- 站内 URL 为 `wiki.html#/effects/resolution`；节内 URL 为 `wiki.html#/effects/resolution@规则与示例`。页面 ID 保持稳定，修改已被引用的标题前检查链接。
- 原始 HTML 仅作为文字显示，不执行。外部链接支持 HTTPS／HTTP；不支持脚本 URL。正文不嵌入交互组件。
- 图片使用从当前页面到根目录 `assets` 的 `../../../assets/...` 路径。本轮不需要正文图片。
- 单一主题只维护一个正式定义，其他页链接它；暂不支持跨页内容嵌入。

## 构建与检查

```sh
npm ci --ignore-scripts
npm run build:wiki
npm run test:wiki
```

将 Markdown、导航和生成的根目录 `wiki-data.js` 一起提交。后者不是编辑源；它让现有静态站和直接打开 HTML 的预览都能阅读 Wiki，不必启动额外框架。首次安装依赖之后，构建与测试均不需要网络。
