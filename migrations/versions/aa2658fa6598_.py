"""empty message

Revision ID: aa2658fa6598
Revises: aa537b105310
Create Date: 2022-03-04 17:51:23.110867

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aa2658fa6598'
down_revision = 'aa537b105310'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('list', sa.Column('share', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('list', 'share')
    # ### end Alembic commands ###