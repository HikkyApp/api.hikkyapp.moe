import * as cheerio from 'cheerio';

// test('return video stream hls avs', async () => {

// const videoServers = await avs.loadVideoServers('223');

// const videoContainer = await avs.loadVideoContainer(
//   videoServers[0],
//   videoServers[0].extraData,
// );

//   // // console.log(data, videoServers, videoContainer)

//   // const headers = { "referer": "https://animevietsub.fan/", "origin": "https://animevietsub.fan" }

//   // const videoSource = videoContainer.videos[0].file.url.replace('https:////', 'https://');

//   // const source = `http://localhost:3031/m3u8-proxy?url=${encodeURIComponent(videoSource)}&headers=${encodeURIComponent(JSON.stringify(headers))}`

const testFunc = async () => {
  for (let i = 0; i < 100; i++) {
    const dataRaw = await fetch(
      `https://animevietsub.fan/anime-moi/trang-${i}.html`,
    );
    const data = await dataRaw.text();
    const $ = cheerio.load(data);
    $('.TPostMv')
      .toArray()
      .map((el) => {
        const source_id = $(el).find('a').attr('href');
        console.log(source_id);
      });
  }
};

testFunc();

//   // // console.log(videoContainer.videos[0].file.url)

//   // console.log(source)
//   // console.log(videoSource)

//   // expect(data).toBeDefined()
// });
