import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { accessInviteLinkRoute } from '../routes/access-invite-link-route'
import { getRankingRoute } from '../routes/get-ranking-route'
import { getSubscriberInviteClicksRoute } from '../routes/get-subscriber-invite-clicks-route'
import { getSubscriberInvitesCountRoute } from '../routes/get-subscriber-invites-count-route'
import { getSubscriberRankingPositionRoute } from '../routes/get-subscriber-ranking-position-route'
import { subscribeToEventRoute } from '../routes/subscription-to-event-route'

// INSTANCE SERVER
const app = fastify().withTypeProvider<ZodTypeProvider>()

// VALIDATION
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)

// DOCUMENTATION CONFIG
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Connect API',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

// DOCUMENTATION ROUTE
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// ROUTES
app.register(subscribeToEventRoute)
app.register(accessInviteLinkRoute)
app.register(getSubscriberInviteClicksRoute)
app.register(getSubscriberInvitesCountRoute)
app.register(getSubscriberRankingPositionRoute)
app.register(getRankingRoute)

// START SERVER
app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}`)
})
