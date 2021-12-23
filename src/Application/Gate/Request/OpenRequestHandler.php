<?php

declare(strict_types=1);

namespace App\Application\Gate\Request;

use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenRequest;

final class OpenRequestHandler
{
    private GateStorage $storage;

    public function __construct(GateStorage $storage)
    {
        $this->storage = $storage;
    }

    public function __invoke(OpenRequestCommand $command): void
    {
        $this->storage->addRequest(
            new OpenRequest($command->userId, $command->gateId),
        );
    }
}
