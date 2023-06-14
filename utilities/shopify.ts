export function shopifyRichTexttoHTML(content: string): string {
  const parsed = JSON.parse(content)
  return parsed.children.map((node: { type: string; level: any; children: any[]; listType: string }) => {
    if (node.type === 'heading') {
      return `<h${node.level}>${node.children[0].value}</h${node.level}>`
    } else if (node.type === 'list') {
      const listType = node.listType === 'unordered' ? 'ul' : 'ol'
      const listItems = node.children.map(item => `<li>${item.children[0].value}</li>`).join('')
      return `<${listType}>${listItems}</${listType}>`
    } else if (node.type === 'paragraph') {
      const paragraphContent = node.children.map((item) => {
        let itemHtml = ''
        if (item.type === 'text') {
          itemHtml += item.bold ? `<strong>${item.value}</strong> ` : ''
          itemHtml += item.italic ? `<em>${item.value}</em> ` : ''
          itemHtml += (!item.bold && !item.italic) ? item.value : ''
        } else if (item.type === 'link') {
          const linkContent = item.children[0].value
          const linkHtml = item.bold
            ? `<strong>${linkContent}</strong>`
            : item.italic
              ? `<em>${linkContent}</em>`
              : linkContent
          itemHtml += `<a href="${item.url}" target="${item.target}">${linkHtml}</a> `
        }
        return itemHtml
      }).join('')
      return `<p>${paragraphContent}</p>`
    } else {
      return ''
    }
  }).join('')
}
