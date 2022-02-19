"""empty message

Revision ID: 2de7cee5767c
Revises: 2807edd385a2
Create Date: 2022-02-19 09:28:11.521851

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2de7cee5767c'
down_revision = '2807edd385a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('name', sa.String(length=120), nullable=False))
    op.drop_constraint('user_email_key', 'user', type_='unique')
    op.create_unique_constraint(None, 'user', ['name'])
    op.drop_column('user', 'is_active')
    op.drop_column('user', 'email')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'user', type_='unique')
    op.create_unique_constraint('user_email_key', 'user', ['email'])
    op.drop_column('user', 'name')
    # ### end Alembic commands ###
