from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loan.id'), nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    principal_paid = db.Column(db.Float, nullable=False, default=0)
    interest_paid = db.Column(db.Float, nullable=False, default=0)
    outstanding_balance = db.Column(db.Float, nullable=False, default=0)
    payment_number = db.Column(db.Integer, nullable=False)  # Número da parcela
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Payment {self.id}: Loan {self.loan_id} - R${self.amount_paid}>'

    def to_dict(self):
        return {
            'id': self.id,
            'loan_id': self.loan_id,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'amount_paid': self.amount_paid,
            'principal_paid': self.principal_paid,
            'interest_paid': self.interest_paid,
            'outstanding_balance': self.outstanding_balance,
            'payment_number': self.payment_number,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

