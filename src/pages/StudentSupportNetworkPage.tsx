import { useState } from 'react'
import { Spinner, Text } from '../components/atoms'
import { EmptyState, ErrorNotice } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { ConnectionDetailPanel, NewConnectionForm, SupportNetworkGraph } from '../components/organisms'
import { useSession } from '../auth/useSession'
import { networkApi } from '../api/network'
import { useLoad } from '../lib/useLoad'

/** "Mi red de apoyo": the student's own weighted, editable support network. */
export function StudentSupportNetworkPage() {
  const { profile } = useSession()
  const reference = profile?.externalReference ?? ''
  const { data: network, loading, error, reload } = useLoad(() => networkApi.supportNetwork(reference), [reference])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (loading) {
    return (
      <AppShell>
        <Spinner center />
      </AppShell>
    )
  }
  if (error || !network) {
    return (
      <AppShell>
        <ErrorNotice error={error} />
      </AppShell>
    )
  }

  const selectedConnection = network.connections.find((connection) => connection.person.reference === selectedId) ?? null

  return (
    <AppShell>
      <StackLayout>
        <div>
          <Text variant="pageTitle">Mi red de apoyo</Text>
          <Text variant="body" color="var(--color-text-secondary)">
            Marca qué tan fuerte sientes el apoyo de cada persona — solo tu equipo de acompañamiento puede verlo.
          </Text>
        </div>

        {network.primarySupport ? (
          <Text variant="label">
            ⭐ Tu principal red de apoyo: {network.primarySupport.person.displayName ?? network.primarySupport.person.reference} ·{' '}
            {Math.max(...network.primarySupport.edges.map((edge) => edge.weight))}/10
            {network.averageWeight !== null ? ` · promedio ${network.averageWeight.toFixed(1)}/10` : ''}
          </Text>
        ) : null}

        {network.connections.length === 0 ? (
          <EmptyState label="Aún no has agregado tu red de apoyo." />
        ) : (
          <SupportNetworkGraph
            studentDisplayName={profile?.fullName ?? 'Tú'}
            network={network}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {selectedConnection ? (
          <ConnectionDetailPanel
            connection={selectedConnection}
            viewerRaterType="SELF"
            onSave={(body) => networkApi.updateConnection(reference, selectedConnection.person.reference, body).then(() => reload())}
            onDelete={() => networkApi.removeConnection(reference, selectedConnection.person.reference).then(() => reload())}
            onClose={() => setSelectedId(null)}
          />
        ) : null}

        <NewConnectionForm onSubmit={(body) => networkApi.createConnection(reference, body).then(() => reload())} />
      </StackLayout>
    </AppShell>
  )
}
