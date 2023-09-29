import AnimeVietSub from '../sources/anime/avs';

jest.setTimeout(15000);

test('return video stream hls avs', async () => {
  const avs = new AnimeVietSub();

  const videoServers = await avs.loadVideoServers('223');

  // const videoContainer = await avs.loadVideoContainer(videoServers[0], videoServers[0].extraData)

  // // console.log(data, videoServers, videoContainer)

  // const headers = { "referer": "https://animevietsub.fan/", "origin": "https://animevietsub.fan" }

  // const videoSource = videoContainer.videos[0].file.url.replace('https:////', 'https://');

  // const source = `http://localhost:3031/m3u8-proxy?url=${encodeURIComponent(videoSource)}&headers=${encodeURIComponent(JSON.stringify(headers))}`

  console.log(videoServers);

  // // console.log(videoContainer.videos[0].file.url)

  // console.log(source)
  // console.log(videoSource)

  // expect(data).toBeDefined()
});
