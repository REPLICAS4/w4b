/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password — Replicas4.com</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>REPLICAS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your Replicas4.com password. Click below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          RESET PASSWORD →
        </Button>
        <Text style={footer}>
          If you didn't request this, your password remains unchanged. You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
