import { Profile } from './profile';
import { Tweet } from './tweet';

export interface FetchProfilesResponse {
  profiles: Profile[];
  next?: string;
}

export type FetchProfiles = (
  query: string,
  maxProfiles: number,
  cursor: string | undefined,
) => Promise<FetchProfilesResponse>;

export interface FetchTweetsResponse {
  tweets: Tweet[];
  next?: string;
}

export type FetchTweets = (
  query: string,
  maxTweets: number,
  cursor: string | undefined,
) => Promise<FetchTweetsResponse>;

export async function* getUserTimeline(
  query: string,
  maxProfiles: number,
  fetchFunc: FetchProfiles,
): AsyncGenerator<Profile> {
  let nProfiles = 0;
  let cursor: string | undefined = undefined;
  while (nProfiles < maxProfiles) {
    const batch: FetchProfilesResponse = await fetchFunc(
      query,
      maxProfiles,
      cursor,
    );

    const { profiles, next } = batch;

    if (profiles.length === 0) {
      break;
    }

    for (const profile of profiles) {
      if (nProfiles < maxProfiles) {
        cursor = next;
        yield profile;
      } else {
        break;
      }

      nProfiles++;
    }
  }
}

export async function* getTweetTimeline(
  query: string,
  maxTweets: number,
  fetchFunc: FetchTweets,
): AsyncGenerator<Tweet> {
  let nTweets = 0;
  let cursor: string | undefined = undefined;
  while (nTweets < maxTweets) {
    const batch: FetchTweetsResponse = await fetchFunc(
      query,
      maxTweets,
      cursor,
    );

    const { tweets, next } = batch;

    if (tweets.length === 0) {
      break;
    }

    for (const tweet of tweets) {
      if (nTweets < maxTweets) {
        cursor = next;
        yield tweet;
      } else {
        break;
      }

      nTweets++;
    }
  }
}
