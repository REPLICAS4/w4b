/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to Replicas4.com</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>REPLICAS</Text>
        <Hr style={divider} />
        <Heading style={h1}>You've been invited</Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>Replicas4.com</strong>
          </Link>
          . Accept below to start forging your replicas.
        </Text>
        <Button style={button} href={confirmationUrl}>
          ACCEPT INVITATION →
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '520px', margin: '0 auto' }
const brand = {
  fontFamily: "'Courier New', monospace",
  fontSize: '11px',
  letterSpacing: '0.3em',
  color: '#c8960a',
  margin: '0 0 16px',
  textTransform: 'uppercase' as const,
}
const divider = { borderColor: '#e5e5e5', margin: '0 0 28px' }
const h1 = {
  fontFamily: "'Georgia', serif",
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1a1f2e',
  margin: '0 0 20px',
}
const text = { fontSize: '14px', color: '#5c6370', lineHeight: '1.7', margin: '0 0 20px' }
const link = { color: '#c8960a', textDecoration: 'underline' }
const button = {
  backgroundColor: '#c8960a',
  color: '#ffffff',
  fontFamily: "'Courier New', monospace",
  fontSize: '12px',
  letterSpacing: '0.15em',
  borderRadius: '4px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0', lineHeight: '1.5' }
