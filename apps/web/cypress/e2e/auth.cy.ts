describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('should display login page', () => {
    cy.contains('Equity Manager')
    cy.contains('ADEO')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('should show error on invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains(/Erreur|Invalid|credentials/i, { timeout: 5000 })
  })

  it('should login successfully with admin credentials', () => {
    cy.get('input[type="email"]').type('admin@adeo.com')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Should redirect to dashboard
    cy.contains('Bienvenue Admin', { timeout: 5000 })
    cy.contains('admin')
    cy.contains('Dashboard')
  })

  it('should switch to register page', () => {
    cy.contains("S'inscrire").click()
    cy.contains('Créer un compte')
    cy.get('input').should('have.length.at.least', 5)
  })

  it('should logout successfully', () => {
    // Login first
    cy.get('input[type="email"]').type('admin@adeo.com')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Wait for dashboard
    cy.contains('Bienvenue Admin', { timeout: 5000 })
    
    // Logout
    cy.contains('Déconnexion').click()
    
    // Should be back to login
    cy.contains('Se connecter')
  })
})
