import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { isDemoMode, handleMockQuery } from './demo-mode'

const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

async function fetchGraphql(
  uri: RequestInfo | URL,
  options?: RequestInit,
  withTags = false
): Promise<Response> {
  if (typeof window === 'undefined' && isDemoMode()) {
    const body = typeof options?.body === 'string' ? options.body : '{}'
    return new Response(JSON.stringify(handleMockQuery(body)), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (withTags) {
    return fetch(uri, { ...options, next: { tags: ['drupal'] } } as RequestInit)
  }

  return fetch(uri, options)
}

function createApolloClient() {
  const isServer = typeof window === 'undefined'

  return new ApolloClient({
    ssrMode: isServer,
    link: new HttpLink({
      uri: drupalUrl ? `${drupalUrl}/graphql` : '/api/graphql',
      credentials: 'same-origin',
      // On the server, tag fetch requests so revalidateTag('drupal') clears the Data Cache
      ...(isServer && {
        fetch: (uri: RequestInfo | URL, options?: RequestInit) =>
          fetchGraphql(uri, options, true),
      }),
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            nodeByPath: {
              keyArgs: ['path'],
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}

let apolloClient: ApolloClient<any> | undefined

export function getApolloClient() {
  // On the server, always create a fresh client to avoid stale in-memory cache
  if (typeof window === 'undefined') return createApolloClient()

  // On the client, reuse the singleton
  if (!apolloClient) apolloClient = createApolloClient()
  return apolloClient
}

// Backward-compatible server helper used by dynamic page routes.
export function getServerApolloClient(_requestHeaders?: Headers) {
  return getApolloClient()
}
