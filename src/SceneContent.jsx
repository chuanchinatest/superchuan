// Add your introduction (scene 1) and experience (scene 2) here later.
// The first version intentionally has no content.
export function SceneContent({scene,transitioning}) {
  return <section className={`scene-content scene-content-${scene}`} data-visible={!transitioning} aria-label="个人内容"/>;
}
