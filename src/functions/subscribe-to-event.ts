import { eq } from 'drizzle-orm'
import { db } from '../database/drizzle/client'
import { subscriptions } from '../database/drizzle/schema/subscriptions'

type SubscribeToEventParams = {
  name: string
  email: string
}

export const subscribeToEvent = async ({
  name,
  email,
}: SubscribeToEventParams) => {
  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscribers.length > 0) {
    return { subscriberId: subscribers[0].id }
  }

  const result = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  const subscriber = result[0]
  return { subscriberId: subscriber.id }
}
