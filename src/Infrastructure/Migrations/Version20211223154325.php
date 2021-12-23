<?php

declare(strict_types=1);

namespace App\Infrastructure\Migrations;

use App\Infrastructure\Gate\AstraApiGate;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20211223154325 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf('postgresql' !== $this->connection->getDatabasePlatform()->getName(), 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE open_request ADD gate_id UUID DEFAULT NULL');
        $this->addSql('UPDATE open_request SET gate_id = :gateId WHERE gate_id IS NULL', ['gateId' => AstraApiGate::SOUTH_GATE]);
        $this->addSql('ALTER TABLE open_request ALTER gate_id SET NOT NULL');
        $this->addSql('COMMENT ON COLUMN open_request.gate_id IS \'(DC2Type:uuid)\'');

        $this->addSql('ALTER TABLE open_success ADD gate_id UUID DEFAULT NULL');
        $this->addSql('UPDATE open_success SET gate_id = :gateId WHERE gate_id IS NULL', ['gateId' => AstraApiGate::SOUTH_GATE]);
        $this->addSql('ALTER TABLE open_success ALTER gate_id SET NOT NULL');
        $this->addSql('COMMENT ON COLUMN open_success.gate_id IS \'(DC2Type:uuid)\'');

        $this->addSql('ALTER TABLE open_fail ADD gate_id UUID DEFAULT NULL');
        $this->addSql('UPDATE open_fail SET gate_id = :gateId WHERE gate_id IS NULL', ['gateId' => AstraApiGate::SOUTH_GATE]);
        $this->addSql('ALTER TABLE open_fail ALTER gate_id SET NOT NULL');
        $this->addSql('COMMENT ON COLUMN open_fail.gate_id IS \'(DC2Type:uuid)\'');
    }

    public function down(Schema $schema): void
    {
        $this->abortIf('postgresql' !== $this->connection->getDatabasePlatform()->getName(), 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE open_request DROP gate_id');
        $this->addSql('ALTER TABLE open_success DROP gate_id');
        $this->addSql('ALTER TABLE open_fail DROP gate_id');
    }
}
