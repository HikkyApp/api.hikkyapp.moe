import { NextFunction, Request, Response } from 'express';
import Api400Error from '../errors/api400Error';
import Api500Error from '../errors/api500Error';
import { ScraperId, getAnimeClassScraper, getRemoteScraper } from '../sources';
import { handleProxy } from '../utils';

const VideoSourceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { source_id, source_media_id, episode_id } = req.query;
  // http://localhost:3001/v1/source?source_id=avs&source_media_id=5040&episode_id=92879

  try {
    if (!source_id) {
      throw new Api400Error('Missing required query parameters');
    }

    const hasScraper = await getRemoteScraper(source_id as string);

    if (!hasScraper) throw new Api400Error('Unknown source id');

    let scraper = getAnimeClassScraper(source_id as ScraperId);

    // If there is no scraper in local but there is a scraper in database, That mean the request trying to get sources from custom scraper
    if (!scraper) {
      scraper = getAnimeClassScraper('custom');
    }

    const { sources, ...data } = await scraper.getSources({
      source_id: source_id.toString(),
      source_media_id: source_media_id.toString(),
      episode_id: episode_id.toString(),
      request: req as any,
    });

    const sourcesWithProxy = handleProxy(sources);

    if (!sources) {
      throw new Api500Error('No sources found');
    }

    res.status(200).json({
      success: true,
      sources: sourcesWithProxy,
      ...data,
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};

export default VideoSourceController;
