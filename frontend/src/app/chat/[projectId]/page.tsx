const page = async ({params} : {params: Promise<{projectId: string}>}) => {
  const {projectId} = await params
  return (
    <div>
      <h1>THis is the project with the id {projectId}</h1>
    </div>
  )
}

export default page