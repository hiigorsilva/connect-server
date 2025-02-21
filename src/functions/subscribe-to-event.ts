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
