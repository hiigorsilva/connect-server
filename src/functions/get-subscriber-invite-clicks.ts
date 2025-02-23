import { redis } from '../database/redis/client'

type GetSubscriberInviteClicksParams = {
  subscriberId: string
}

export const getSubscriberInviteClicks = async ({
  subscriberId,
}: GetSubscriberInviteClicksParams) => {
  const count = await redis.hget('referral:access-count', subscriberId)

  return { count: count ? Number.parseInt(count) : 0 }
}
