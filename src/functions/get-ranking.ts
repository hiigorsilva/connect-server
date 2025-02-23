import { inArray } from 'drizzle-orm'
import { db } from '../database/drizzle/client'
import { subscriptions } from '../database/drizzle/schema/subscriptions'
import { redis } from '../database/redis/client'

export const getRanking = async () => {
  const ranking = await redis.zrevrange('referral:ranking', 0, 2, 'WITHSCORES')
  const subscriberIdAndScore: Record<string, number> = {}

  for (let i = 0; i < ranking.length; i += 2) {
    subscriberIdAndScore[ranking[i]] = Number.parseInt(ranking[i + 1])
  }

  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(subscriberIdAndScore)))

  const rankingWithScore = subscribers
    .map(subscriber => {
      return {
        id: subscriber.id,
        name: subscriber.name,
        score: subscriberIdAndScore[subscriber.id],
      }
    })
    .sort((subscriber1, subscriber2) => {
      const order = subscriber2.score - subscriber1.score
      return order
    })

  return { rankingWithScore }
}
