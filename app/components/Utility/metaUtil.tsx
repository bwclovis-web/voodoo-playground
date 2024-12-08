export interface MetaData {
  title: string;
  description: string;
}

const metaUtil = (data: MetaData) => {
  const metaData = data as MetaData
  return [
    { title: metaData?.title },
    { content: metaData?.description, name: "description" }
  ]
}

export default metaUtil
