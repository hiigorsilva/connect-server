import { eq } from 'drizzle-orm'
import { db } from '../database/drizzle/client'
import { schema } from '../database/drizzle/schema'
import { redis } from '../database/redis/client'

type SubscribeToEventParams = {
  name: string
  email: string
  referrerId?: string | null
}

export const subscribeToEvent = async ({
  name,
  email,
  referrerId,
}: SubscribeToEventParams) => {
  const subscribers = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.email, email))

  if (subscribers.length > 0) {
    return { subscriberId: subscribers[0].id }
  }

  const result = await db
    .insert(schema.subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  if (referrerId) {
    await redis.zincrby('referral:ranking', 1, referrerId)
  }

  const subscriber = result[0]
  return { subscriberId: subscriber.id }
}
