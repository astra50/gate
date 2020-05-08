<?php

declare(strict_types=1);

namespace App\Application\Gate\Open;

use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenFail;
use App\Domain\Gate\OpenSuccess;

final class OpenHandler
{
    private GateStorage $storage;

    public function __construct(GateStorage $storage)
    {
        $this->storage = $storage;
    }

    public function __invoke(OpenCommand $command): void
    {
        $this->storage->addSuccess(
            new OpenSuccess($command->requestId)
        );

//        $this->storage->addFail(
//            new OpenFail(
//                $command->requestId,
//                []
//            )
//        );
    }
}
