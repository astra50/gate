<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenFail;
use App\Domain\Gate\OpenRequest;
use App\Domain\Gate\OpenSuccess;
use App\Infrastructure\ManagerRegistry;

final class DoctrineGateStorage implements GateStorage
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * {@inheritdoc}
     */
    public function addRequest(OpenRequest $request): void
    {
        $this->registry->getManager()->persist($request);
    }

    /**
     * {@inheritdoc}
     */
    public function addSuccess(OpenSuccess $success): void
    {
        $this->registry->getManager()->persist($success);
    }

    /**
     * {@inheritdoc}
     */
    public function addFail(OpenFail $fail): void
    {
        $this->registry->getManager()->persist($fail);
    }
}
