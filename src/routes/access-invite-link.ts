import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link and redirects user to event',
        tags: ['referral'],
        description: 'Subscribe someone to event',
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params
      await accessInviteLink({ subscriberId })

      const redirectUrl = new URL(env.WEB_URL)
      redirectUrl.searchParams.set('referral', subscriberId)

      return reply.redirect(redirectUrl.toString(), 302)
      // 302 significa Redirect Temporary, e não vai cachear os dados. Então, todos os redirects vão ser contabilizados. Isso não aconteceria com o 301 que chacheia os dados
    }
  )
}
