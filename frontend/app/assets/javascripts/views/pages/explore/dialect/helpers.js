import selectn from 'selectn'
export const getDialectClassname = (computed) => {
  const fvaDialect = selectn('response.properties.fva:dialect', computed)
  const fvaLanguage = selectn('response.properties.fva:language', computed)

  const dialect = {
    '794c6d51-a8ec-4a57-ad91-93a586ee3b8c': 'fontOskiDakelh',
  }
  const language = {
    'bfd8144e-7029-4b29-8600-fc608c1447d9': 'fontOskiDakelh',
  }

  return dialect[fvaDialect] || language[fvaLanguage] || 'fontAboriginalSans'
}
