<?php

declare(strict_types=1);

namespace App\Infrastructure\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20200508140122 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf('postgresql' !== $this->connection->getDatabasePlatform()->getName(), 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE open_success (
          id UUID NOT NULL, 
          request_id UUID NOT NULL, 
          created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, 
          PRIMARY KEY(id)
        )');
        $this->addSql('COMMENT ON COLUMN open_success.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN open_success.request_id IS \'(DC2Type:gate_request_id)\'');
        $this->addSql('COMMENT ON COLUMN open_success.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('CREATE TABLE open_fail (
          id UUID NOT NULL, 
          request_id UUID NOT NULL, 
          payload JSON NOT NULL, 
          created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, 
          PRIMARY KEY(id)
        )');
        $this->addSql('COMMENT ON COLUMN open_fail.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN open_fail.request_id IS \'(DC2Type:gate_request_id)\'');
        $this->addSql('COMMENT ON COLUMN open_fail.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('CREATE TABLE open_request (
          id UUID NOT NULL, 
          user_id UUID NOT NULL, 
          created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, 
          PRIMARY KEY(id)
        )');
        $this->addSql('COMMENT ON COLUMN open_request.id IS \'(DC2Type:gate_request_id)\'');
        $this->addSql('COMMENT ON COLUMN open_request.user_id IS \'(DC2Type:user_id)\'');
        $this->addSql('COMMENT ON COLUMN open_request.created_at IS \'(DC2Type:datetimetz_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->abortIf('postgresql' !== $this->connection->getDatabasePlatform()->getName(), 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE open_success');
        $this->addSql('DROP TABLE open_fail');
        $this->addSql('DROP TABLE open_request');
    }
}
