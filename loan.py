from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    borrower_name = db.Column(db.String(100), nullable=False)
    principal_amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)  # Taxa de juros mensal em %
    loan_term_months = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    first_payment_due_date = db.Column(db.Date, nullable=False)
    loan_type = db.Column(db.String(10), nullable=False, default='SAC')  # SAC ou PRICE
    status = db.Column(db.String(20), nullable=False, default='active')  # active, inactive, paid_off
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com pagamentos
    payments = db.relationship('Payment', backref='loan', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Loan {self.id}: {self.borrower_name} - R${self.principal_amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'borrower_name': self.borrower_name,
            'principal_amount': self.principal_amount,
            'interest_rate': self.interest_rate,
            'loan_term_months': self.loan_term_months,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'first_payment_due_date': self.first_payment_due_date.isoformat() if self.first_payment_due_date else None,
            'loan_type': self.loan_type,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def calculate_outstanding_balance(self):
        """Calcula o saldo devedor atual baseado nos pagamentos já realizados"""
        total_paid = sum([payment.amount_paid for payment in self.payments])
        # Aqui seria necessário implementar o cálculo de juros compostos
        # Por simplicidade, retornamos o valor principal menos o total pago
        return max(0, self.principal_amount - total_paid)

    def get_next_payment_amount(self):
        """Calcula o valor da próxima parcela (implementação simplificada)"""
        if self.loan_type == 'SAC':
            # Sistema SAC: parcela principal fixa + juros sobre saldo devedor
            principal_payment = self.principal_amount / self.loan_term_months
            outstanding = self.calculate_outstanding_balance()
            interest_payment = outstanding * (self.interest_rate / 100)
            return principal_payment + interest_payment
        else:
            # Sistema PRICE: parcela fixa
            monthly_rate = self.interest_rate / 100
            if monthly_rate == 0:
                return self.principal_amount / self.loan_term_months
            return self.principal_amount * (monthly_rate * (1 + monthly_rate) ** self.loan_term_months) / ((1 + monthly_rate) ** self.loan_term_months - 1)

