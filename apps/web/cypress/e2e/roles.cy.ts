describe('Role-Based Access Control', () => {
  it('Admin should have full access', () => {
    cy.visit('http://localhost:5173')
    cy.get('input[type="email"]').type('admin@adeo.com')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Bienvenue Admin', { timeout: 5000 })
    cy.contains('admin')
    
    // Go to shareholders list
    cy.contains('Actionnaires').click()
    
    // Should see all buttons
    cy.contains('Ajouter un actionnaire').should('be.visible')
    cy.contains('Éditer').should('be.visible')
    cy.contains('Supprimer').should('be.visible')
  })

  it('Editor should have edit access but not delete', () => {
    cy.visit('http://localhost:5173')
    cy.get('input[type="email"]').type('editor@adeo.com')
    cy.get('input[type="password"]').type('editor123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Bienvenue Editor', { timeout: 5000 })
    cy.contains('editor')
    
    // Go to shareholders list
    cy.contains('Actionnaires').click()
    
    // Should see add and edit buttons
    cy.contains('Ajouter un actionnaire').should('be.visible')
    cy.contains('Éditer').should('be.visible')
    
    // Should NOT see delete button
    cy.contains('Supprimer').should('not.exist')
  })

  it('Viewer should only view data', () => {
    cy.visit('http://localhost:5173')
    cy.get('input[type="email"]').type('viewer@adeo.com')
    cy.get('input[type="password"]').type('viewer123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Bienvenue Viewer', { timeout: 5000 })
    cy.contains('viewer')
    
    // Can view dashboard
    cy.contains('Dashboard')
    cy.contains('Total Actionnaires')
    
    // Go to shareholders list
    cy.contains('Actionnaires').click()
    
    // Should NOT see any action buttons
    cy.contains('Ajouter un actionnaire').should('not.exist')
    cy.contains('Éditer').should('not.exist')
    cy.contains('Supprimer').should('not.exist')
    
    // But should see the data
    cy.contains('Admin')
    cy.contains('Editor')
  })

  it('Should maintain role restrictions after page refresh', () => {
    cy.visit('http://localhost:5173')
    cy.get('input[type="email"]').type('viewer@adeo.com')
    cy.get('input[type="password"]').type('viewer123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Bienvenue Viewer', { timeout: 5000 })
    
    // Refresh page
    cy.reload()
    
    // Should still be logged in as viewer
    cy.contains('Bienvenue Viewer', { timeout: 5000 })
    
    // Go to list and verify no action buttons
    cy.contains('Actionnaires').click()
    cy.contains('Ajouter un actionnaire').should('not.exist')
  })
})
