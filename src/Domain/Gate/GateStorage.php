<?php

declare(strict_types=1);

namespace App\Domain\Gate;

interface GateStorage
{
    public function addRequest(OpenRequest $request): void;

    public function addSuccess(OpenSuccess $success): void;

    public function addFail(OpenFail $fail): void;
}
