describe('Shareholders CRUD', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('http://localhost:5173')
    cy.get('input[type="email"]').type('admin@adeo.com')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.contains('Bienvenue Admin', { timeout: 5000 })
  })

  it('should display dashboard with statistics', () => {
    cy.contains('Dashboard')
    cy.contains('Total Actionnaires')
    cy.contains('Total Parts')
    cy.contains('Moyenne Parts/Personne')
  })

  it('should switch to shareholders list', () => {
    cy.contains('Actionnaires').click()
    cy.contains('Admin')
    cy.contains('Editor')
    cy.contains('Viewer')
  })

  it('should open create shareholder modal', () => {
    // Go to list
    cy.contains('Actionnaires').click()
    
    // Click add button
    cy.contains('Ajouter un actionnaire').click()
    
    // Check modal opened with form
    cy.contains('Ajouter un actionnaire')
    cy.get('input').should('have.length.at.least', 5)
    cy.contains('Annuler')
    cy.get('button[type="submit"]')
    
    // Close modal
    cy.contains('Annuler').click()
  })

  it('should edit a shareholder', () => {
    // Go to list
    cy.contains('Actionnaires').click()
    
    // Click first edit button
    cy.contains('Éditer').first().click()
    
    // Modify name
    cy.get('input').eq(0).clear().type('Modified')
    
    // Submit
    cy.contains('Mettre à jour').click()
    
    // Check if updated
    cy.contains('Modified', { timeout: 5000 })
  })

  it('should delete a shareholder', () => {
    // Go to list
    cy.contains('Actionnaires').click()
    
    // Get initial count
    cy.get('tbody tr').then($rows => {
      const initialCount = $rows.length
      
      // Click delete on first shareholder
      cy.contains('Supprimer').first().click()
      
      // Confirm deletion in browser alert
      cy.on('window:confirm', () => true)
      
      // Check count decreased
      cy.get('tbody tr', { timeout: 5000 }).should('have.length', initialCount - 1)
    })
  })

  it('should display charts on dashboard', () => {
    cy.contains('Dashboard').click()
    
    // Check for chart elements
    cy.get('canvas').should('have.length.at.least', 2)
    cy.contains('Répartition par Business Unit')
    cy.contains('Top 5 Actionnaires')
  })

  it('should display business unit details table', () => {
    cy.contains('Dashboard').click()
    
    cy.contains('Détails par Business Unit')
    cy.contains('Actionnaires')
    cy.contains('Total Parts')
    cy.contains('Pourcentage')
  })
})
