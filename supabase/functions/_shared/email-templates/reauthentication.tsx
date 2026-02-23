/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code — Replicas4.com</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>REPLICAS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Verification code</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code expires shortly. If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#c8960a',
  letterSpacing: '0.2em',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0', lineHeight: '1.5' }
